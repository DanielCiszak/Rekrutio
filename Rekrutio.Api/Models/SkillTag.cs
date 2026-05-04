using System.ComponentModel.DataAnnotations;

namespace Rekrutio.Api.Models;

public class SkillTag
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(80)]
    public string Name { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public ICollection<JobApplicationSkill> JobApplicationSkills { get; set; } = new List<JobApplicationSkill>();
}
