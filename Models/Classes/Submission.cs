using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models.Classes
{
    public class Submission
    {
        public int Id { get; set; }
        public int? IdExam { get; set; }
        public int? IdUser { get; set; }
        public DateTime? TimeStarted { get; set; }
        public DateTime? TimeLastSaved { get; set; }
        public DateTime? TimeSubmitted { get; set; }
        public string IpAddress { get; set; }

        public List<SubmissionAnswer> SubmissionAnswers { get; set; }
        public List<SubmissionQuestionOrder> SubmissionQuestionOrders { get; set; }
        public User User { get; set; }
        public Exam Exam { get; set; }
    }
}
