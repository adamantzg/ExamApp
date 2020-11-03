using ExamApp.Models.Classes;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExamApp.Models
{
    public class ExamRepository : GenericRepository<Exam>, IExamRepository
    {
        public ExamRepository(DbContext context) : base(context)
        {
        }

        public override void Update(Exam entityToUpdate)
        {
            var existing = dbSet.Include("ExamUsers").Include("Questions.Children").FirstOrDefault(e => e.Id == entityToUpdate.Id);

            if (existing != null)
            {
                context.Entry(existing).CurrentValues.SetValues(entityToUpdate);
                foreach (var eu in entityToUpdate.ExamUsers)
                {
                    var existingUser = existing.ExamUsers
                        .FirstOrDefault(x => x.IdUser == eu.IdUser);

                    if (existingUser == null)
                    {
                        existing.ExamUsers.Add(eu);
                    }
                }

                foreach (var eu in existing.ExamUsers)
                {
                    if (!entityToUpdate.ExamUsers.Any(u => u.IdUser == eu.IdUser))
                    {
                        context.Remove(eu);
                    }
                }

                foreach (var q in entityToUpdate.Questions)
                {
                    var existingQuestion = q.Id > 0 ? existing.Questions
                        .FirstOrDefault(x => x.Id == q.Id) : null;

                    if (existingQuestion == null)
                    {
                        existing.Questions.Add(q);
                    }
                    else
                    {
                        context.Entry(existingQuestion).CurrentValues.SetValues(q);
                        if (q.Children != null)
                        {
                            foreach (var cq in q.Children)
                            {
                                var existingChild = cq.Id > 0 ? existingQuestion.Children.FirstOrDefault(x => x.Id == cq.Id) : null;
                                if (existingChild == null)
                                {
                                    existingQuestion.Children.Add(cq);
                                }
                                else
                                {
                                    context.Entry(existingChild).CurrentValues.SetValues(cq);
                                }
                            }
                        }
                        foreach (var eq in existingQuestion.Children)
                        {
                            if (!q.Children.Any(x => x.Id == eq.Id))
                            {
                                context.Remove(eq);
                            }
                        }

                    }
                }

                foreach (var eq in existing.Questions)
                {
                    if (!entityToUpdate.Questions.Any(q => q.Id == eq.Id))
                    {
                        context.Remove(eq);
                    }
                }
            }

        }

        public Exam Copy(int id)
        {
            var source = dbSet.Include("Questions.Children").FirstOrDefault(e => e.Id == id);
            if (source != null) 
            {
                var result = (Exam)context.Entry(source).CurrentValues.ToObject();
                result.Questions = new List<Question>();
                foreach(var q in source.Questions)
                {
                    var destQuestion = (Question)context.Entry(q).CurrentValues.ToObject();
                    destQuestion.Id = 0;
                    destQuestion.Children = new List<Question>();
                    foreach(var c in q.Children)
                    {
                        var childQuestion = (Question)context.Entry(c).CurrentValues.ToObject();
                        childQuestion.Id = 0;
                        childQuestion.IdParent = null;
                        destQuestion.Children.Add(childQuestion);
                    }
                    result.Questions.Add(destQuestion);
                }
                result.Title += " - Copy";
                result.Id = 0;
                dbSet.Add(result);
                context.SaveChanges();
                context.Entry(result).Reference(e => e.ExamType).Load();
                context.Entry(result).Reference(e => e.Course).Load();
                return result;
            }
            return null;

        }
    }
}
