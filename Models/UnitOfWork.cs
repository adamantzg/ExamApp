using System;
using System.Collections.Generic;
using System.Text;
using ExamApp.Models.Classes;
using Microsoft.EntityFrameworkCore;

namespace ExamApp.Models
{
    public class UnitOfWork : IUnitOfWork
    {
	    private MyContext context;

	    public UnitOfWork(MyContext context)
	    {
		    this.context = context;
	    }

	    public void Save()
	    {
		    context.SaveChanges();
	    }

	    public IGenericRepository<User> UserRepository => new GenericRepository<User>(context);

		public IGenericRepository<Group> GroupRepository => new GenericRepository<Group>(context);

		public IGenericRepository<Course> CourseRepository => new GenericRepository<Course>(context);

		public IExamRepository ExamRepository => new ExamRepository(context);

		public IGenericRepository<ExamType> ExamTypeRepository => new GenericRepository<ExamType>(context);

		public IGenericRepository<Database> DatabaseRepository => new GenericRepository<Database>(context);

		public IGenericRepository<QuestionType> QuestionTypeRepository => new GenericRepository<QuestionType>(context);

		public ISubmissionRepository SubmissionRepository => new SubmissionRepository(context);
	}
}
