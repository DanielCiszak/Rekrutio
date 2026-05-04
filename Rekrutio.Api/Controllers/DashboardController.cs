using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rekrutio.Api.Data;
using Rekrutio.Api.DTOs;
using Rekrutio.Api.Models;

namespace Rekrutio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
    {
        var applicationsQuery = dbContext.JobApplications.AsNoTracking();

        var latestApplications = await applicationsQuery
            .OrderByDescending(jobApplication => jobApplication.CreatedAt)
            .Take(5)
            .Select(jobApplication => new DashboardLatestApplicationDto
            {
                Id = jobApplication.Id,
                CompanyName = jobApplication.Company.Name,
                PositionTitle = jobApplication.PositionTitle,
                Status = jobApplication.Status,
                CreatedAt = jobApplication.CreatedAt
            })
            .ToListAsync();

        var summary = new DashboardSummaryDto
        {
            TotalApplications = await applicationsQuery.CountAsync(),
            PlannedCount = await applicationsQuery.CountAsync(jobApplication => jobApplication.Status == ApplicationStatus.Planned),
            AppliedCount = await applicationsQuery.CountAsync(jobApplication => jobApplication.Status == ApplicationStatus.Applied),
            InterviewCount = await applicationsQuery.CountAsync(jobApplication => jobApplication.Status == ApplicationStatus.Interview),
            OfferCount = await applicationsQuery.CountAsync(jobApplication => jobApplication.Status == ApplicationStatus.Offer),
            RejectedCount = await applicationsQuery.CountAsync(jobApplication => jobApplication.Status == ApplicationStatus.Rejected),
            TotalCompanies = await dbContext.Companies.AsNoTracking().CountAsync(),
            AverageSalaryMin = await applicationsQuery
                .AverageAsync(jobApplication => jobApplication.SalaryMin),
            AverageSalaryMax = await applicationsQuery
                .AverageAsync(jobApplication => jobApplication.SalaryMax),
            LatestApplications = latestApplications
        };

        return Ok(summary);
    }
}
