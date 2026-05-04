using System.ComponentModel.DataAnnotations;

namespace Rekrutio.Api.Models;

public class Company
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? WebsiteUrl { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public ICollection<JobApplication> JobApplications { get; set; } = new List<JobApplication>();
}
