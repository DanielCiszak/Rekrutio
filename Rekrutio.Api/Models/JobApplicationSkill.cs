namespace Rekrutio.Api.Models;

public class JobApplicationSkill
{
    public Guid JobApplicationId { get; set; }

    public JobApplication JobApplication { get; set; } = null!;

    public Guid SkillTagId { get; set; }

    public SkillTag SkillTag { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
