using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models.Classes
{
    public class SubmissionAnswerLog
    {
        public int id { get; set; }
        public int? idSubmissionAnswer { get; set; }
        public DateTime? DateTimeChanged { get; set; }
        public string AnswerText { get; set; }
    }
}
