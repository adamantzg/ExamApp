using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models.Classes
{
    public class SubmissionAnswer
    {
        public int Id { get; set; }
        public int? IdSubmission { get; set; }
        public int? IdQuestion { get; set; }
        public string AnswerText { get; set; }
        public Question Question { get; set; }
        public double? Points { get; set; }

        public List<SubmissionAnswerChoice> SubmissionAnswerChoices { get; set; }
        public List<SubmissionAnswerLog> Logs { get; set; }

        [NotMapped]
        public List<SubmissionAnswer> ChildAnswers { get; set; }
    }
}
