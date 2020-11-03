using ExamApp.Models.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models
{
    public interface IUnitOfWork
    {
        void Save();

        IGenericRepository<User> UserRepository { get; }
        IGenericRepository<Group> GroupRepository { get; }
        IGenericRepository<Course> CourseRepository { get; }
        IExamRepository ExamRepository { get; }
        IGenericRepository<ExamType> ExamTypeRepository { get; }
        IGenericRepository<Database> DatabaseRepository { get; }
        IGenericRepository<QuestionType> QuestionTypeRepository { get; }
        ISubmissionRepository SubmissionRepository { get; }
        
    }
}
