using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models.Classes
{
    public class QuestionResource
    {
        public int IdQuestion { get; set; }
        public int IdResource { get; set; }

        public Resource Resource { get; set; }
    }
}
