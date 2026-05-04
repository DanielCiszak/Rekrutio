using Rekrutio.Api.Models;

namespace Rekrutio.Api.DTOs;

public class ApplicationStatusHistoryResponseDto
{
    public Guid Id { get; set; }

    public Guid JobApplicationId { get; set; }

    public ApplicationStatus Status { get; set; }

    public DateTime ChangedAt { get; set; }

    public string? Notes { get; set; }
}
