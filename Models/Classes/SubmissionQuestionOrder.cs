using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models.Classes
{
    public class SubmissionQuestionOrder
    {
        public int Id { get; set; }
        public int? IdSubmission { get; set; }
        public int? IdQuestion { get; set; }
        public int? OrderNo { get; set; }
    }
}
