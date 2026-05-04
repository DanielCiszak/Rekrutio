using Rekrutio.Api.Models;

namespace Rekrutio.Api.DTOs;

public class DashboardLatestApplicationDto
{
    public Guid Id { get; set; }

    public string CompanyName { get; set; } = string.Empty;

    public string PositionTitle { get; set; } = string.Empty;

    public ApplicationStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }
}
