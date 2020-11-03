using ExamApp.Models.Classes;

namespace ExamApp.Models
{
    public interface IExamRepository : IGenericRepository<Exam>
    {
        Exam Copy(int id);        
    }
}