using ExamApp.Models.Classes;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models
{
    public class SubmissionRepository : GenericRepository<Submission>, ISubmissionRepository
    {
        public SubmissionRepository(DbContext context) : base(context)
        {
        }

        public List<SubmissionAnswerLog> GetAnswerLogs(int idQuestion)
        {
            var answerIds = new List<int?>();
            var answer = context.Set<SubmissionAnswer>().Include("Question.Children").FirstOrDefault(a => a.IdQuestion == idQuestion);
            if (answer != null)
                answerIds.Add(answer.Id);
            else
            {
                var questionIds = context.Set<Question>().Where(q => q.IdParent == idQuestion).Select(q => (int?)q.Id).ToList();
                answerIds.AddRange(context.Set<SubmissionAnswer>().Where(a => questionIds.Contains(a.IdQuestion)).ToList()
                    .Select(a => (int?) a.Id));
            }
                
            return context.Set<SubmissionAnswerLog>().Where(a => answerIds.Contains(a.idSubmissionAnswer)).OrderBy(a => a.DateTimeChanged)
                .ToList();
        }
    }
}
