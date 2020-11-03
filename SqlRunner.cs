using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.SqlClient;

namespace ExamApp
{
    public interface ISqlRunner
    {
        SqlResults ExecuteSql(string sql, string connString, int topResults = 20, bool action = false);
    }

    public class SqlRunner : ISqlRunner
    {
        public SqlResults ExecuteSql(string sql, string connString, int topResults = 20, bool action = false)
        {
            using(var conn = new SqlConnection(connString))
            {
                conn.Open();
                //try
                {
                    var result = new SqlResults {
                        FieldNames = new List<string>(),
                        Count = 0
                    };                   
                    if(!action)
                    {
                        var countSql = GetCountSql(sql);
                        result.Count = countSql != null ? conn.ExecuteScalar<long>(countSql) : 0;

                        var finalSql = sql.Contains("SELECT") ?
                            ReplaceFirst(sql, "SELECT", $"SELECT TOP {topResults}") : sql;
                        if (result.Count > 0)
                        {
                            result.Data = conn.Query(finalSql).ToList();
                            foreach (IDictionary<string, object> row in result.Data)
                            {
                                result.FieldNames = row.Keys.ToList();
                                break;
                            }

                        }
                        else
                        {
                            result.Data = new List<object>();
                            var dr = conn.ExecuteReader(finalSql);
                            for (var i = 0; i < dr.FieldCount; i++)
                            {
                                result.FieldNames.Add(dr.GetName(i));
                            }
                        }

                        return result;
                    }
                    else
                    {
                        if(sql.Contains("SELECT") && !sql.StartsWith("UPDATE") && !sql.StartsWith("INSERT"))
                        {
                            if(!sql.Contains("EXEC"))
                            {
                                result.Data = conn.Query(sql).ToList();
                                foreach (IDictionary<string, object> row in result.Data)
                                {
                                    result.FieldNames = row.Keys.ToList();
                                    break;
                                }
                            }
                            else
                            {
                                var reader = conn.QueryMultiple(sql);
                                result.MultipleData = new List<dynamic>();
                                result.FieldNamesMultiple = new List<IList<string>>();
                                dynamic rowSet;
                                while(!reader.IsConsumed)
                                {
                                    rowSet = reader.Read();
                                    result.MultipleData.Add(rowSet);
                                    foreach (IDictionary<string, object> row in rowSet)
                                    {
                                        result.FieldNamesMultiple.Add(row.Keys.ToList());
                                        break;
                                    }
                                }
                            }
                            
                        } 
                        else
                        {
                            result.Count = conn.Execute(sql);
                        }                        
                        return result;
                    }
                    
                }

            }
            return null;
        }

        public string ReplaceFirst(string text, string search, string replace)
        {
            int pos = text.IndexOf(search);
            if (pos < 0)
            {
                return text;
            }
            return text.Substring(0, pos) + replace + text.Substring(pos + search.Length);
        }

        private string GetCountSql(string sql)
        {
            if(sql.Contains("SELECT"))
            {
                var isGroupBy = sql.Contains("GROUP BY");                
                var fromIndex = sql.IndexOf("FROM");
                var regex = new Regex("(MAX)|(MIN)|(SUM)|(COUNT)|(AVG)");
                var isScalarSql = isScalar(sql);
                if(regex.Match(sql.Substring(0,fromIndex)).Success && !isGroupBy && !isScalarSql)
                {
                    return "SELECT 1";
                }
                var orderByIndex = sql.IndexOf("ORDER BY");
                sql = orderByIndex < 0 ? sql : sql.Substring(0, orderByIndex);
                if(!isGroupBy && !isScalarSql)
                {
                    if (fromIndex >= 0)
                    {
                        return "SELECT COUNT(*) " + sql.Substring(fromIndex);
                    }
                } else
                {
                    return $"SELECT COUNT(*) FROM ({sql}) subq";
                }
                
            }
            return null;
        }

        private bool isScalar(string sql)
        {
            var select1Index = sql.IndexOf("SELECT");
            var select2Index = sql.IndexOf("SELECT", select1Index + 1);
            if (select2Index < 0)
                return false;
            return !sql.Substring(0, select2Index).Contains("FROM");
        }
    }

    public class SqlResults
    {
        public IList<string> FieldNames { get; set; }
        public dynamic Data { get; set; }
        public long Count { get; set; }
        public List<dynamic> MultipleData { get; set; }
        public List<IList<string>> FieldNamesMultiple { get; set; }
    }
}
