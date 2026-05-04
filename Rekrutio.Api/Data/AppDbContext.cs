using Microsoft.EntityFrameworkCore;
using Rekrutio.Api.Models;

namespace Rekrutio.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Company> Companies => Set<Company>();

    public DbSet<JobApplication> JobApplications => Set<JobApplication>();

    public DbSet<ApplicationStatusHistory> ApplicationStatusHistory => Set<ApplicationStatusHistory>();

    public DbSet<SkillTag> SkillTags => Set<SkillTag>();

    public DbSet<JobApplicationSkill> JobApplicationSkills => Set<JobApplicationSkill>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasKey(company => company.Id);

            entity.HasMany(company => company.JobApplications)
                .WithOne(jobApplication => jobApplication.Company)
                .HasForeignKey(jobApplication => jobApplication.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<JobApplication>(entity =>
        {
            entity.HasKey(jobApplication => jobApplication.Id);

            entity.HasMany(jobApplication => jobApplication.StatusHistory)
                .WithOne(statusHistory => statusHistory.JobApplication)
                .HasForeignKey(statusHistory => statusHistory.JobApplicationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ApplicationStatusHistory>(entity =>
        {
            entity.HasKey(statusHistory => statusHistory.Id);
        });

        modelBuilder.Entity<SkillTag>(entity =>
        {
            entity.HasKey(skillTag => skillTag.Id);

            entity.HasIndex(skillTag => skillTag.Name)
                .IsUnique();
        });

        modelBuilder.Entity<JobApplicationSkill>(entity =>
        {
            entity.HasKey(jobApplicationSkill => new
            {
                jobApplicationSkill.JobApplicationId,
                jobApplicationSkill.SkillTagId
            });

            entity.HasOne(jobApplicationSkill => jobApplicationSkill.JobApplication)
                .WithMany(jobApplication => jobApplication.JobApplicationSkills)
                .HasForeignKey(jobApplicationSkill => jobApplicationSkill.JobApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(jobApplicationSkill => jobApplicationSkill.SkillTag)
                .WithMany(skillTag => skillTag.JobApplicationSkills)
                .HasForeignKey(jobApplicationSkill => jobApplicationSkill.SkillTagId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
