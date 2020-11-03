using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models.Classes
{
    public class SubmissionAnswerChoice
    {
        public int IdSubmissionAnswer { get; set; }
        public int IdChoice { get; set; }

        public QuestionChoice Choice { get; set; }
    }
}
