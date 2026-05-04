using System.ComponentModel.DataAnnotations;

namespace Rekrutio.Api.Models;

public class JobApplication
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid CompanyId { get; set; }

    public Company Company { get; set; } = null!;

    [Required]
    [MaxLength(200)]
    public string PositionTitle { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? JobUrl { get; set; }

    [MaxLength(100)]
    public string? SalaryRange { get; set; }

    public ContractType ContractType { get; set; } = ContractType.Unknown;

    public WorkMode WorkMode { get; set; } = WorkMode.Unknown;

    public ApplicationStatus CurrentStatus { get; set; } = ApplicationStatus.Planned;

    public DateTime? AppliedAt { get; set; }

    [MaxLength(2000)]
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public ICollection<ApplicationStatusHistory> StatusHistory { get; set; } = new List<ApplicationStatusHistory>();

    public ICollection<JobApplicationSkill> JobApplicationSkills { get; set; } = new List<JobApplicationSkill>();
}
