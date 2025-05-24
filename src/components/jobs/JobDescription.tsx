import React from 'react';
import { Company } from '@/types/company';
import { Skill } from '@/types/skill';
import { Job } from '@/types/job';


interface JobDescriptionProps {
  job: Job;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ job }) => {
  // Format salary
  const formatSalary = (salary: number) => {
    if (salary >= 1000) {
      return `${(salary / 1000).toFixed(0)}k VND`;
    }
    return `${salary} VND`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get unique skills (remove duplicates)
  const uniqueSkills = job.skills.filter((skill, index, self) => 
    index === self.findIndex(s => s.name === skill.name)
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {job.description}
            </p>
          </section>
        </div>

        {/* Right Column - Job Details */}
        <div className="space-y-6">
          {/* About this role */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">About this role</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium text-teal-600">{job.quantity} applied</span> of {job.quantity} capacity
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Apply Before</span>
                <span className="font-medium text-gray-900">{formatDate(job.endDate)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Job Posted On</span>
                <span className="font-medium text-gray-900">{formatDate(job.staterDate)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Job Type</span>
                <span className="font-medium text-gray-900">Full-Time</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Salary</span>
                <span className="font-medium text-gray-900">{formatSalary(job.salary)}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Level</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {job.level}
              </span>
            </div>
          </div>
          {/* Location */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                {job.location}
              </span>
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {uniqueSkills.map((skill, index) => (
                <span 
                  key={`${skill.id}-${index}`}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Company</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-bold text-lg">
                    {job.company.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{job.company.name}</h4>
                  <p className="text-sm text-gray-600">{job.company.address}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">{job.company.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;