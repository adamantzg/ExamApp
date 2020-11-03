using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models.Classes
{
    public class Group
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public List<UserGroup> UserGroups { get; set; }        
    }
}
