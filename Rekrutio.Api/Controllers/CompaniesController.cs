using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rekrutio.Api.Data;
using Rekrutio.Api.DTOs;
using Rekrutio.Api.Models;

namespace Rekrutio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompaniesController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CompanyResponseDto>>> GetCompanies()
    {
        var companies = await dbContext.Companies
            .AsNoTracking()
            .OrderBy(company => company.Name)
            .Select(company => ToResponseDto(company))
            .ToListAsync();

        return Ok(companies);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CompanyResponseDto>> GetCompany(Guid id)
    {
        var company = await dbContext.Companies
            .AsNoTracking()
            .FirstOrDefaultAsync(company => company.Id == id);

        if (company is null)
        {
            return NotFound();
        }

        return Ok(ToResponseDto(company));
    }

    [HttpPost]
    public async Task<ActionResult<CompanyResponseDto>> CreateCompany(CreateCompanyDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            ModelState.AddModelError(nameof(request.Name), "Company name is required.");
            return ValidationProblem(ModelState);
        }

        var company = new Company
        {
            Name = request.Name.Trim(),
            WebsiteUrl = string.IsNullOrWhiteSpace(request.WebsiteUrl) ? null : request.WebsiteUrl.Trim(),
            Location = string.IsNullOrWhiteSpace(request.Location) ? null : request.Location.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        dbContext.Companies.Add(company);
        await dbContext.SaveChangesAsync();

        var response = ToResponseDto(company);

        return CreatedAtAction(nameof(GetCompany), new { id = company.Id }, response);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateCompany(Guid id, UpdateCompanyDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            ModelState.AddModelError(nameof(request.Name), "Company name is required.");
            return ValidationProblem(ModelState);
        }

        var company = await dbContext.Companies.FindAsync(id);

        if (company is null)
        {
            return NotFound();
        }

        company.Name = request.Name.Trim();
        company.WebsiteUrl = string.IsNullOrWhiteSpace(request.WebsiteUrl) ? null : request.WebsiteUrl.Trim();
        company.Location = string.IsNullOrWhiteSpace(request.Location) ? null : request.Location.Trim();
        company.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteCompany(Guid id)
    {
        var company = await dbContext.Companies.FindAsync(id);

        if (company is null)
        {
            return NotFound();
        }

        dbContext.Companies.Remove(company);
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    private static CompanyResponseDto ToResponseDto(Company company)
    {
        return new CompanyResponseDto
        {
            Id = company.Id,
            Name = company.Name,
            WebsiteUrl = company.WebsiteUrl,
            Location = company.Location,
            CreatedAt = company.CreatedAt,
            UpdatedAt = company.UpdatedAt
        };
    }
}
