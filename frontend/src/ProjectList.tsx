import { useEffect, useState } from "react";
import type { Project } from "./types/Project";

function ProjectList({ selectedCategories }: { selectedCategories: string[] }) {

    const [projects, setProjects] = useState<Project[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    useEffect(() => {
        const fetchProjects = async () => {

            const categoryParams = selectedCategories.map(cat => `projectTypes=${encodeURIComponent(cat)}`).join('&');

            const response = await fetch(`https://localhost:5000/Water/AllProjects?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`);
            const data = await response.json();
            setProjects(data.projects);
            setTotalItems(data.totalNumProjects);
            setTotalPages(Math.ceil(data.totalNumProjects / pageSize));
        }
        fetchProjects();
    }, [pageSize, pageNum, totalItems, selectedCategories]);

    return (
        <>

            {projects.map((p) => (
                <div id="projectCard" className="card" key={p.projectId}>
                    <h3 className="card-title">{p.projectName}</h3>
                    
                    <div className="card-body">
                        <ul className="list-unstyled">
                            <li><strong>Project Type:</strong> {p.projectType}</li>
                            <li><strong>Regional Program:</strong> {p.projectRegionalProgram}</li>
                            <li><strong>Impact:</strong> {p.projectImpact}</li>
                            <li><strong>Project Phase:</strong> {p.projectPhase}</li>
                            <li><strong>Project Status:</strong> {p.projectFunctionalityStatus}</li>
                        </ul>
                    </div>
                </div>
            ))}

            <br />

            {/* Pagination Controls */}
            <button onClick={() => setPageNum(pageNum - 1)} disabled={pageNum === 1}>
                Previous
            </button>
            {
                [...Array(totalPages)].map((_, i) => (
                    <button key={i + 1} onClick={() => setPageNum(i + 1)} disabled={pageNum === i + 1}>
                        {i + 1}
                    </button>
                ))
            }
            <button onClick={() => setPageNum(pageNum + 1)} disabled={pageNum === totalPages}>
                Next
            </button>

            <br />
            <label>
                Results per page:
                <select value={pageSize} onChange={
                    (e) => {
                        setPageSize(Number(e.target.value));
                        setPageNum(1); // reset to first page when page size changes
                    }
                    }>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </label>




        </>

    );
}

export default ProjectList;