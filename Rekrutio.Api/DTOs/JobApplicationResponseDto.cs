using Rekrutio.Api.Models;

namespace Rekrutio.Api.DTOs;

public class JobApplicationResponseDto
{
    public Guid Id { get; set; }

    public Guid CompanyId { get; set; }

    public string CompanyName { get; set; } = string.Empty;

    public string PositionTitle { get; set; } = string.Empty;

    public string? JobAdvertUrl { get; set; }

    public string? Location { get; set; }

    public decimal? SalaryMin { get; set; }

    public decimal? SalaryMax { get; set; }

    public ContractType ContractType { get; set; }

    public WorkMode WorkMode { get; set; }

    public ApplicationStatus Status { get; set; }

    public DateTime? AppliedAt { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
