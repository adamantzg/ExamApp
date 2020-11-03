using ExamApp.Models.Classes;
using System.Collections.Generic;

namespace ExamApp.Models
{
    public interface ISubmissionRepository : IGenericRepository<Submission>
    {
        List<SubmissionAnswerLog> GetAnswerLogs(int idSubmissionAnswer);
    }
}