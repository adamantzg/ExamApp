using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models.Classes
{
    public class QuestionChoice
    {
        public int Id { get; set; }
        public int? IdQuestion { get; set; }
        public string ChoiceText { get; set; }
        public short? Correct { get; set; }
    }
}
