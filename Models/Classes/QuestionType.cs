using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models.Classes
{
    public class QuestionType
    {
        public const int MultipleChoice = 1;
        public const int Sql = 2;
        public const int SqlAction = 3;
        public const int Group = 4;

        public int Id { get; set; }
        public string Name { get; set; }
    }
}
