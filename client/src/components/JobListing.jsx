import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext'; // Import AppContext
import { assets, JobCategories, JobLocations } from '../assets/assets/assets';
import JobCard from './JobCard';

const JobListing = () => {
    const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext); // Destructure values from AppContext

    const [showFilter, setShowFilter] = useState(true);
    const [CurrentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState(jobs);

    const handleCategoryChange = (category) => {
        setSelectedCategory((prev) => {
            if (prev.includes(category)) {
                return prev.filter((cat) => cat !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    const handleLocationChange = (location) => {
        setSelectedLocation((prev) => {
            if (prev.includes(location)) {
                return prev.filter((cat) => cat !== location);
            } else {
                return [...prev, location];
            }
        });
    };

  useEffect(() => {

    if (jobs.length > 0) {
        const matchedCategory = job =>
            selectedCategory.length === 0 || selectedCategory.includes(job.category);

        const matchedLocation = job =>
            selectedLocation.length === 0 || selectedLocation.includes(job.location);

        const matchedTitle = job =>
            searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase());

        const matchedSearchLocation = (job) =>
            searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase());


        const newFilterJobs = jobs.slice().reverse().filter (
            job =>matchedCategory(job) &&
            matchedLocation(job) && matchedTitle(job) &&
            matchedSearchLocation(job)
        )

        console.log("Filtered Jobs:", newFilterJobs); // Debugging log
        setFilteredJobs(newFilterJobs);
        setCurrentPage(1);
    }
}, [jobs, selectedCategory, selectedLocation, searchFilter]);

    return (
        <div className='container 2xl:px-20 mx-auto my-10 flex flex-col lg:flex-row max-lg:space-y-8 py-8'>
            {/* Side-bar */}
            <div className='w-full lg:w-1/4 bg-white px-4'>
                {/* Search filter from Hero component */}
                {isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
                    <>
                        <h3 className='font-medium text-lg mb-4'>Current Search</h3>
                        <div>
                            {searchFilter.title && (
                                <span className='inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>
                                    {searchFilter.title}
                                    <img
                                        onClick={() => setSearchFilter((prev) => ({ ...prev, title: "" }))}
                                        className='cursor-pointer'
                                        src={assets.cross_icon}
                                        alt=""
                                    />
                                </span>
                            )}
                            {searchFilter.location && (
                                <span className='ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded'>
                                    {searchFilter.location}
                                    <img
                                        onClick={() => setSearchFilter((prev) => ({ ...prev, location: "" }))}
                                        className='cursor-pointer'
                                        src={assets.cross_icon}
                                        alt=""
                                    />
                                </span>
                            )}
                        </div>
                    </>
                )}

                <button
                    onClick={() => setShowFilter((prev) => !prev)}
                    className='px-6 py-1.5 rounded border border-gray-400 lg:hidden'
                >
                    {showFilter ? "Close" : "Filters"}
                </button>

                {/* Filter options */}
                <div className={showFilter ? "block" : "hidden"}>
                    <h4 className='font-medium text-lg py-4'>Search by Categories</h4>
                    <ul className='space-y-4 text-gray-600'>
                        {JobCategories.map((category, index) => (
                            <li className="flex gap-3 items-center" key={index}>
                                <input
                                    type="checkbox"
                                    onChange={() => handleCategoryChange(category)}
                                    checked={selectedCategory.includes(category)}
                                />
                                {category}
                            </li>
                        ))}
                    </ul>

                    <h4 className='font-medium text-lg py-4'>Search by Location</h4>
                    <ul className='space-y-4 text-gray-600'>
                        {JobLocations.map((location, index) => (
                            <li className="flex gap-3 items-center" key={index}>
                                <input
                                    type="checkbox"
                                    onChange={() => handleLocationChange(location)}
                                    checked={selectedLocation.includes(location)}
                                />
                                {location}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Job listings */}
            <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4 pt-14'>
                <h3 className='font-medium text-3xl py-2' id='job-list'>Latest Jobs</h3>
                <p className='mb-8'>Get your desired jobs from top companies</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {filteredJobs.length > 0 ? (
                        filteredJobs.slice((CurrentPage - 1) * 6, CurrentPage * 6).map((job, index) => (
                            <JobCard key={index} job={job} />
                        ))
                    ) : (
                        <p className='text-gray-500'>No jobs found matching your criteria.</p>
                    )}
                </div>

                {/* Pagination */}
                {filteredJobs.length > 0 && (
                    <div className='flex justify-center items-center gap-4 mt-8'>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className='p-2 border border-gray-300 rounded'
                            disabled={CurrentPage === 1}
                        >
                            <img src={assets.left_arrow_icon} alt="Previous" />
                        </button>
                        {Array.from({ length: Math.ceil(jobs.length / 6) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${CurrentPage === index + 1 ? 'bg-blue-100 text-blue-500' : 'text-gray-500'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(jobs.length / 6)))}
                            className='p-2 border border-gray-300 rounded'
                            disabled={CurrentPage === Math.ceil(jobs.length / 6)}
                        >
                            <img src={assets.right_arrow_icon} alt="Next" />
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default JobListing;