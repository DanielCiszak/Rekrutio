using System.ComponentModel.DataAnnotations;
using Rekrutio.Api.Models;

namespace Rekrutio.Api.DTOs;

public class UpdateJobApplicationDto
{
    [Required]
    public Guid CompanyId { get; set; }

    [Required]
    [MaxLength(200)]
    public string PositionTitle { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? JobAdvertUrl { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    [Range(0, 9999999)]
    public decimal? SalaryMin { get; set; }

    [Range(0, 9999999)]
    public decimal? SalaryMax { get; set; }

    public ContractType ContractType { get; set; } = ContractType.Unknown;

    public WorkMode WorkMode { get; set; } = WorkMode.Unknown;

    public ApplicationStatus Status { get; set; } = ApplicationStatus.Planned;

    [MaxLength(2000)]
    public string? Notes { get; set; }
}
