using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rekrutio.Api.Data;
using Rekrutio.Api.DTOs;
using Rekrutio.Api.Models;

namespace Rekrutio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobApplicationsController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<JobApplicationResponseDto>>> GetJobApplications(
        [FromQuery] ApplicationStatus? status,
        [FromQuery] ContractType? contractType,
        [FromQuery] WorkMode? workMode,
        [FromQuery] Guid? companyId,
        [FromQuery] string? location,
        [FromQuery] string? searchTerm)
    {
        var query = dbContext.JobApplications.AsNoTracking();

        if (status.HasValue)
        {
            query = query.Where(jobApplication => jobApplication.Status == status.Value);
        }

        if (contractType.HasValue)
        {
            query = query.Where(jobApplication => jobApplication.ContractType == contractType.Value);
        }

        if (workMode.HasValue)
        {
            query = query.Where(jobApplication => jobApplication.WorkMode == workMode.Value);
        }

        if (companyId.HasValue)
        {
            query = query.Where(jobApplication => jobApplication.CompanyId == companyId.Value);
        }

        if (!string.IsNullOrWhiteSpace(location))
        {
            var normalizedLocation = location.Trim();
            query = query.Where(jobApplication =>
                jobApplication.Location != null &&
                jobApplication.Location.Contains(normalizedLocation));
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var normalizedSearchTerm = searchTerm.Trim();
            query = query.Where(jobApplication =>
                jobApplication.PositionTitle.Contains(normalizedSearchTerm) ||
                jobApplication.Company.Name.Contains(normalizedSearchTerm) ||
                (jobApplication.Location != null && jobApplication.Location.Contains(normalizedSearchTerm)) ||
                (jobApplication.Notes != null && jobApplication.Notes.Contains(normalizedSearchTerm)));
        }

        var jobApplications = await query
            .OrderByDescending(jobApplication => jobApplication.CreatedAt)
            .Select(jobApplication => new JobApplicationResponseDto
            {
                Id = jobApplication.Id,
                CompanyId = jobApplication.CompanyId,
                CompanyName = jobApplication.Company.Name,
                PositionTitle = jobApplication.PositionTitle,
                JobAdvertUrl = jobApplication.JobAdvertUrl,
                Location = jobApplication.Location,
                SalaryMin = jobApplication.SalaryMin,
                SalaryMax = jobApplication.SalaryMax,
                ContractType = jobApplication.ContractType,
                WorkMode = jobApplication.WorkMode,
                Status = jobApplication.Status,
                AppliedAt = jobApplication.AppliedAt,
                Notes = jobApplication.Notes,
                CreatedAt = jobApplication.CreatedAt,
                UpdatedAt = jobApplication.UpdatedAt
            })
            .ToListAsync();

        return Ok(jobApplications);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<JobApplicationResponseDto>> GetJobApplication(Guid id)
    {
        var jobApplication = await dbContext.JobApplications
            .AsNoTracking()
            .Where(jobApplication => jobApplication.Id == id)
            .Select(jobApplication => new JobApplicationResponseDto
            {
                Id = jobApplication.Id,
                CompanyId = jobApplication.CompanyId,
                CompanyName = jobApplication.Company.Name,
                PositionTitle = jobApplication.PositionTitle,
                JobAdvertUrl = jobApplication.JobAdvertUrl,
                Location = jobApplication.Location,
                SalaryMin = jobApplication.SalaryMin,
                SalaryMax = jobApplication.SalaryMax,
                ContractType = jobApplication.ContractType,
                WorkMode = jobApplication.WorkMode,
                Status = jobApplication.Status,
                AppliedAt = jobApplication.AppliedAt,
                Notes = jobApplication.Notes,
                CreatedAt = jobApplication.CreatedAt,
                UpdatedAt = jobApplication.UpdatedAt
            })
            .FirstOrDefaultAsync();

        if (jobApplication is null)
        {
            return NotFound();
        }

        return Ok(jobApplication);
    }

    [HttpGet("{id:guid}/status-history")]
    public async Task<ActionResult<IEnumerable<ApplicationStatusHistoryResponseDto>>> GetStatusHistory(Guid id)
    {
        var jobApplicationExists = await dbContext.JobApplications
            .AsNoTracking()
            .AnyAsync(jobApplication => jobApplication.Id == id);

        if (!jobApplicationExists)
        {
            return NotFound();
        }

        var statusHistory = await dbContext.ApplicationStatusHistory
            .AsNoTracking()
            .Where(statusHistory => statusHistory.JobApplicationId == id)
            .OrderBy(statusHistory => statusHistory.ChangedAt)
            .Select(statusHistory => new ApplicationStatusHistoryResponseDto
            {
                Id = statusHistory.Id,
                JobApplicationId = statusHistory.JobApplicationId,
                Status = statusHistory.Status,
                ChangedAt = statusHistory.ChangedAt,
                Notes = statusHistory.Notes
            })
            .ToListAsync();

        return Ok(statusHistory);
    }

    [HttpPost]
    public async Task<ActionResult<JobApplicationResponseDto>> CreateJobApplication(CreateJobApplicationDto request)
    {
        var validationResult = ValidateJobApplicationRequest(request);

        if (validationResult is not null)
        {
            return validationResult;
        }

        var company = await dbContext.Companies.FindAsync(request.CompanyId);

        if (company is null)
        {
            return NotFound($"Company with id '{request.CompanyId}' was not found.");
        }

        var jobApplication = new JobApplication
        {
            CompanyId = request.CompanyId,
            Company = company,
            PositionTitle = request.PositionTitle.Trim(),
            JobAdvertUrl = NormalizeOptionalText(request.JobAdvertUrl),
            Location = NormalizeOptionalText(request.Location),
            SalaryMin = request.SalaryMin,
            SalaryMax = request.SalaryMax,
            ContractType = request.ContractType,
            WorkMode = request.WorkMode,
            Status = request.Status,
            AppliedAt = request.Status == ApplicationStatus.Applied ? DateTime.UtcNow : null,
            Notes = NormalizeOptionalText(request.Notes),
            CreatedAt = DateTime.UtcNow
        };

        dbContext.JobApplications.Add(jobApplication);
        dbContext.ApplicationStatusHistory.Add(new ApplicationStatusHistory
        {
            JobApplicationId = jobApplication.Id,
            JobApplication = jobApplication,
            Status = jobApplication.Status,
            ChangedAt = DateTime.UtcNow,
            Notes = jobApplication.Notes
        });

        await dbContext.SaveChangesAsync();

        var response = ToResponseDto(jobApplication);

        return CreatedAtAction(nameof(GetJobApplication), new { id = jobApplication.Id }, response);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateJobApplication(Guid id, UpdateJobApplicationDto request)
    {
        var validationResult = ValidateJobApplicationRequest(request);

        if (validationResult is not null)
        {
            return validationResult;
        }

        var companyExists = await dbContext.Companies
            .AnyAsync(company => company.Id == request.CompanyId);

        if (!companyExists)
        {
            return NotFound($"Company with id '{request.CompanyId}' was not found.");
        }

        var jobApplication = await dbContext.JobApplications.FindAsync(id);

        if (jobApplication is null)
        {
            return NotFound();
        }

        var previousStatus = jobApplication.Status;

        jobApplication.CompanyId = request.CompanyId;
        jobApplication.PositionTitle = request.PositionTitle.Trim();
        jobApplication.JobAdvertUrl = NormalizeOptionalText(request.JobAdvertUrl);
        jobApplication.Location = NormalizeOptionalText(request.Location);
        jobApplication.SalaryMin = request.SalaryMin;
        jobApplication.SalaryMax = request.SalaryMax;
        jobApplication.ContractType = request.ContractType;
        jobApplication.WorkMode = request.WorkMode;
        jobApplication.Status = request.Status;
        jobApplication.Notes = NormalizeOptionalText(request.Notes);
        jobApplication.UpdatedAt = DateTime.UtcNow;

        if (previousStatus != jobApplication.Status)
        {
            dbContext.ApplicationStatusHistory.Add(new ApplicationStatusHistory
            {
                JobApplicationId = jobApplication.Id,
                Status = jobApplication.Status,
                ChangedAt = DateTime.UtcNow,
                Notes = jobApplication.Notes
            });
        }

        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteJobApplication(Guid id)
    {
        var jobApplication = await dbContext.JobApplications.FindAsync(id);

        if (jobApplication is null)
        {
            return NotFound();
        }

        dbContext.JobApplications.Remove(jobApplication);
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    private ActionResult? ValidateJobApplicationRequest(CreateJobApplicationDto request)
    {
        return ValidateJobApplicationValues(
            request.PositionTitle,
            request.SalaryMin,
            request.SalaryMax,
            request.ContractType,
            request.WorkMode,
            request.Status);
    }

    private ActionResult? ValidateJobApplicationRequest(UpdateJobApplicationDto request)
    {
        return ValidateJobApplicationValues(
            request.PositionTitle,
            request.SalaryMin,
            request.SalaryMax,
            request.ContractType,
            request.WorkMode,
            request.Status);
    }

    private ActionResult? ValidateJobApplicationValues(
        string positionTitle,
        decimal? salaryMin,
        decimal? salaryMax,
        ContractType contractType,
        WorkMode workMode,
        ApplicationStatus status)
    {
        if (string.IsNullOrWhiteSpace(positionTitle))
        {
            ModelState.AddModelError(nameof(CreateJobApplicationDto.PositionTitle), "Position title is required.");
        }

        if (salaryMin.HasValue && salaryMax.HasValue && salaryMin > salaryMax)
        {
            ModelState.AddModelError(nameof(CreateJobApplicationDto.SalaryMin), "SalaryMin cannot be greater than SalaryMax.");
        }

        if (!Enum.IsDefined(contractType))
        {
            ModelState.AddModelError(nameof(CreateJobApplicationDto.ContractType), "Contract type is invalid.");
        }

        if (!Enum.IsDefined(workMode))
        {
            ModelState.AddModelError(nameof(CreateJobApplicationDto.WorkMode), "Work mode is invalid.");
        }

        if (!Enum.IsDefined(status))
        {
            ModelState.AddModelError(nameof(CreateJobApplicationDto.Status), "Status is invalid.");
        }

        return ModelState.IsValid ? null : ValidationProblem(ModelState);
    }

    private static string? NormalizeOptionalText(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private static JobApplicationResponseDto ToResponseDto(JobApplication jobApplication)
    {
        return new JobApplicationResponseDto
        {
            Id = jobApplication.Id,
            CompanyId = jobApplication.CompanyId,
            CompanyName = jobApplication.Company.Name,
            PositionTitle = jobApplication.PositionTitle,
            JobAdvertUrl = jobApplication.JobAdvertUrl,
            Location = jobApplication.Location,
            SalaryMin = jobApplication.SalaryMin,
            SalaryMax = jobApplication.SalaryMax,
            ContractType = jobApplication.ContractType,
            WorkMode = jobApplication.WorkMode,
            Status = jobApplication.Status,
            AppliedAt = jobApplication.AppliedAt,
            Notes = jobApplication.Notes,
            CreatedAt = jobApplication.CreatedAt,
            UpdatedAt = jobApplication.UpdatedAt
        };
    }
}
