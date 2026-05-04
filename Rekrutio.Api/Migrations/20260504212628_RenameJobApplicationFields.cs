using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Rekrutio.Api.Migrations
{
    /// <inheritdoc />
    public partial class RenameJobApplicationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SalaryRange",
                table: "JobApplications");

            migrationBuilder.RenameColumn(
                name: "JobUrl",
                table: "JobApplications",
                newName: "JobAdvertUrl");

            migrationBuilder.RenameColumn(
                name: "CurrentStatus",
                table: "JobApplications",
                newName: "Status");

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "JobApplications",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SalaryMax",
                table: "JobApplications",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SalaryMin",
                table: "JobApplications",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "JobApplications");

            migrationBuilder.DropColumn(
                name: "SalaryMax",
                table: "JobApplications");

            migrationBuilder.DropColumn(
                name: "SalaryMin",
                table: "JobApplications");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "JobApplications",
                newName: "CurrentStatus");

            migrationBuilder.RenameColumn(
                name: "JobAdvertUrl",
                table: "JobApplications",
                newName: "JobUrl");

            migrationBuilder.AddColumn<string>(
                name: "SalaryRange",
                table: "JobApplications",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }
    }
}
