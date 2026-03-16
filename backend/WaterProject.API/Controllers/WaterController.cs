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
        public IActionResult Get(int pageSize = 5, int pageNum = 1) {

            var something = _waterContext.Projects.Skip((pageNum - 1) * pageSize).Take(pageSize).ToList();
            var totalNumProjects = _waterContext.Projects.Count();

            // builds generic object to return
            return Ok(new {
                TotalNumProjects = totalNumProjects,
                Projects = something
            });
        }

        [HttpGet("FunctionalProjects")]
        public IEnumerable<Projects> GetFunctionalProjects()
        {
            return _waterContext.Projects.Where(p => p.ProjectFunctionalityStatus == "Functional").ToList();
        }
    }
}
