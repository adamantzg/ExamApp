using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models.Classes
{
    public class Question
    {
        public int Id { get; set; }
        public int? IdType { get; set; }
        public int? IdExam { get; set; }
        [Required]
        public string QuestionText { get; set; }
        public int? OrderNo { get; set; }
        public int? IdDatabase { get; set; }
        public int? Records { get; set; }
        public int? Points { get; set; }
        public int? IdParent { get; set; }

        public List<QuestionChoice> QuestionChoices { get; set; }
        public List<QuestionResource> QuestionResources { get; set; }
        public List<Question> Children { get; set; }
        public Question Parent { get; set; }
    }
}
