using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExamApp.Models.Classes;
using Microsoft.EntityFrameworkCore;

namespace ExamApp.Models
{
    public class MyContext : DbContext
    {
        public MyContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("user");
            modelBuilder.Entity<Course>().ToTable("course");
            modelBuilder.Entity<Database>().ToTable("database");
            modelBuilder.Entity<Exam>().ToTable("exam");
            modelBuilder.Entity<ExamResource>().ToTable("examresource");
            modelBuilder.Entity<ExamResource>().HasKey(er => new { er.IdExam, er.IdResource });
            modelBuilder.Entity<ExamType>().ToTable("examtype");
            modelBuilder.Entity<ExamUser>().ToTable("examuser");
            modelBuilder.Entity<ExamUser>().HasKey(eu => new { eu.IdExam, eu.IdUser });
            modelBuilder.Entity<Group>().ToTable("group");
            modelBuilder.Entity<Question>().ToTable("question");
            modelBuilder.Entity<QuestionChoice>().ToTable("questionchoice");
            modelBuilder.Entity<QuestionResource>().ToTable("questionresource");
            modelBuilder.Entity<QuestionResource>().HasKey(qr => new { qr.IdQuestion, qr.IdResource });
            modelBuilder.Entity<QuestionType>().ToTable("questiontype");
            modelBuilder.Entity<Resource>().ToTable("resource");
            modelBuilder.Entity<Submission>().ToTable("submission");
            modelBuilder.Entity<SubmissionAnswer>().ToTable("submissionanswer");
            modelBuilder.Entity<SubmissionAnswerChoice>().ToTable("submissionanswerchoice");
            modelBuilder.Entity<SubmissionAnswerChoice>().HasKey(sac => new { sac.IdChoice, sac.IdSubmissionAnswer });
            modelBuilder.Entity<UserCourse>().ToTable("usercourse");
            modelBuilder.Entity<UserGroup>().ToTable("usergroup");
            modelBuilder.Entity<UserGroup>().HasKey(ug => new { ug.IdUser, ug.IdGroup });
            modelBuilder.Entity<UserGroup>().HasOne(ug => ug.Group).WithMany(g => g.UserGroups).HasForeignKey(ug => ug.IdGroup);
            modelBuilder.Entity<UserGroup>().HasOne(ug => ug.User).WithMany(u => u.UserGroups).HasForeignKey(ug => ug.IdUser);

            modelBuilder.Entity<UserCourse>().HasOne(uc => uc.User).WithMany(u => u.UserCourses).HasForeignKey(uc => uc.IdUser);
            modelBuilder.Entity<UserCourse>().HasOne(uc => uc.Group).WithMany().HasForeignKey(uc => uc.IdGroup);
            modelBuilder.Entity<UserCourse>().HasOne(uc => uc.Course).WithMany().HasForeignKey(uc => uc.IdCourse);

            modelBuilder.Entity<User>().HasMany(u => u.UserCourses).WithOne(uc => uc.User).HasForeignKey(uc => uc.IdUser);
            modelBuilder.Entity<User>().HasMany(u => u.UserGroups).WithOne(ug=>ug.User).HasForeignKey(ug => ug.IdUser);
            modelBuilder.Entity<Exam>().HasMany(e => e.Questions).WithOne().HasForeignKey(q => q.IdExam);
            modelBuilder.Entity<Exam>().HasMany(e => e.Submissions).WithOne(s=>s.Exam).HasForeignKey(s => s.IdExam);
            modelBuilder.Entity<Exam>().HasMany(e => e.ExamUsers).WithOne().HasForeignKey(u => u.IdExam);
            modelBuilder.Entity<Exam>().HasMany(e => e.ExamResources).WithOne().HasForeignKey(r => r.IdExam);
            modelBuilder.Entity<Exam>().HasOne(e => e.Course).WithMany().HasForeignKey(e => e.IdCourse);
            modelBuilder.Entity<Exam>().HasOne(e => e.ExamType).WithMany().HasForeignKey(e => e.IdType);
            modelBuilder.Entity<Exam>().HasOne(e => e.Database).WithMany().HasForeignKey(e => e.IdDatabase);

            modelBuilder.Entity<ExamResource>().HasOne(er => er.Resource).WithMany().HasForeignKey(er => er.IdResource);
            modelBuilder.Entity<ExamUser>().HasOne(eu => eu.User).WithMany().HasForeignKey(eu => eu.IdUser);

            modelBuilder.Entity<Question>().HasMany(q => q.QuestionChoices).WithOne().HasForeignKey(c => c.IdQuestion);
            modelBuilder.Entity<Question>().HasMany(q => q.QuestionResources).WithOne().HasForeignKey(r => r.IdQuestion);
            modelBuilder.Entity<Question>().HasMany(q => q.Children).WithOne(q => q.Parent).HasForeignKey(q => q.IdParent);

            modelBuilder.Entity<QuestionResource>().HasOne(qr => qr.Resource).WithMany().HasForeignKey(qr => qr.IdResource);

            modelBuilder.Entity<Submission>().HasMany(s => s.SubmissionAnswers).WithOne().HasForeignKey(sa => sa.IdSubmission);
            modelBuilder.Entity<Submission>().HasMany(s => s.SubmissionQuestionOrders).WithOne().HasForeignKey(sq => sq.IdSubmission);
            modelBuilder.Entity<Submission>().HasOne(s => s.User).WithMany().HasForeignKey(s => s.IdUser);
            modelBuilder.Entity<SubmissionAnswer>().HasMany(sa => sa.SubmissionAnswerChoices).WithOne().HasForeignKey(sac => sac.IdSubmissionAnswer);
            modelBuilder.Entity<SubmissionAnswer>().HasMany(sa => sa.Logs).WithOne().HasForeignKey(l => l.idSubmissionAnswer);
            modelBuilder.Entity<SubmissionAnswer>().HasOne(sa => sa.Question).WithMany().HasForeignKey(sa => sa.IdQuestion);




            base.OnModelCreating(modelBuilder);
        }
    }
}
