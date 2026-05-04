using System.ComponentModel.DataAnnotations;

namespace Rekrutio.Api.Models;

public class ApplicationStatusHistory
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid JobApplicationId { get; set; }

    public JobApplication JobApplication { get; set; } = null!;

    public ApplicationStatus Status { get; set; }

    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(1000)]
    public string? Notes { get; set; }
}
