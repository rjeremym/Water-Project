using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WaterProject.API.Data;



namespace WaterProject.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WaterController : ControllerBase
    {

        private WaterDbContext _waterContext;
        public WaterController(WaterDbContext temp) => _waterContext = temp;

        [HttpGet("AllProjects")]
        public IActionResult Get(int pageSize = 5, int pageNum = 1, [FromQuery] List<string>? projectTypes = null) {

            var query = _waterContext.Projects.AsQueryable();

            if (projectTypes != null && projectTypes.Any())
            {
                query = query.Where(p => projectTypes.Contains(p.ProjectType));
            }

            var totalNumProjects = query.Count();

            var something = query.Skip((pageNum - 1) * pageSize).Take(pageSize).ToList();

            // builds generic object to return
            return Ok(new {
                TotalNumProjects = totalNumProjects,
                Projects = something
            });
        }

        [HttpGet("GetProjectTypes")]
        public IActionResult GetProjectTypes()
        {
            var projectTypes = _waterContext.Projects.Select(p => p.ProjectType).Distinct().ToList();
            return Ok(projectTypes);
        }

        
    }
}
