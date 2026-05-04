using System.ComponentModel.DataAnnotations;

namespace Rekrutio.Api.DTOs;

public class CreateCompanyDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? WebsiteUrl { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }
}
