import { useEffect, useState } from "react";
import type { Project } from "../types/Project";
import { deleteProject, fetchProjects } from "../api/ProjectAPI";
import Pagination from "../components/Pagination";
import NewProjectForm from "../components/NewProjectForm";
import EditProjectForm from "../components/EditProjectForm";

const AdminProjectsPage = () => {

    const [projects, setProjects] = useState<Project[]>([]);
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await fetchProjects(pageSize, pageNum, []);
                setProjects(data.projects);
                setTotalPages(Math.ceil(data.totalNumProjects / pageSize));
                setError(null);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, [pageSize, pageNum]);

    const handleDelete = async (projectId: number) => {

        const confirmDelete = window.confirm("Are you sure you want to delete this project?");
        if (!confirmDelete) return;
        try {
            await deleteProject(projectId);
            setProjects(projects.filter(p => p.projectId !== projectId));
        } catch (err) {
            setError((err as Error).message);
        }
    };


    if (loading) {
        return <p>Loading projects...</p>;
    }
    if (error) {
        return <p className='text-danger'>Error loading projects: {error}</p>;
    }
    
    return (
        <div className="container mt-4">    
            <h1>Admin Projects Page</h1>

            {/* whether to show the form or not */}
            {!showForm && <button className="btn btn-success mb-3" onClick={() => setShowForm(true)}>Add New Project</button>}

            {showForm && (
            <NewProjectForm
                onSuccess={() => {
                setShowForm(false);
                fetchProjects(pageSize, pageNum, []).then((data) =>
                    setProjects(data.projects)
                );
                }}
                onCancel={() => setShowForm(false)}
            />
            )}                
            
            {/* whether or not to show the edit form */}
                {editingProject && (
                <EditProjectForm
                    project={editingProject}
                    onSuccess={() => {
                    setEditingProject(null);
                    fetchProjects(pageSize, pageNum, []).then((data) =>
                        setProjects(data.projects)
                    );
                    }}
                    onCancel={() => setEditingProject(null)}
                />
                )}
                
            <table className='table table-bordered table-striped'>
                <thead className='table-dark'>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Regional Program</th>
                        <th>Impact</th>
                        <th>Phase</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((p) => (
                        <tr key={p.projectId}>
                            <td>{p.projectId}</td>
                            <td>{p.projectName}</td>
                            <td>{p.projectType}</td>
                            <td>{p.projectRegionalProgram}</td>
                            <td>{p.projectImpact}</td>
                            <td>{p.projectPhase}</td>
                            <td>{p.projectFunctionalityStatus}</td>
                            <td>
                                <button className="btn btn-primary btn-sm" onClick={()=> setEditingProject(p)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.projectId)}>Delete</button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>

            <Pagination currentPage={pageNum} totalPages={totalPages} pageSize={pageSize} onPageChange={setPageNum} onPageSizeChange={(newSize) => {setPageSize(newSize); setPageNum(1);}} />
        </div>
    );
};

export default AdminProjectsPage;