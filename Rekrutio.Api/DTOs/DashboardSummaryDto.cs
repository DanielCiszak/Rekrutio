namespace Rekrutio.Api.DTOs;

public class DashboardSummaryDto
{
    public int TotalApplications { get; set; }

    public int PlannedCount { get; set; }

    public int AppliedCount { get; set; }

    public int InterviewCount { get; set; }

    public int OfferCount { get; set; }

    public int RejectedCount { get; set; }

    public int TotalCompanies { get; set; }

    public decimal? AverageSalaryMin { get; set; }

    public decimal? AverageSalaryMax { get; set; }

    public IEnumerable<DashboardLatestApplicationDto> LatestApplications { get; set; } = [];
}
