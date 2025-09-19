import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const SkillsInput = ({ skills = [], onChange, isEditing, placeholder }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim()) {
      onChange([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="space-y-2">
      {isEditing ? (
        <form onSubmit={handleAddSkill} className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder={placeholder}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          >
            <Plus size={16} className="mr-1" />
            Add
          </button>
        </form>
      ) : null}
      
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
          >
            {skill}
            {isEditing && (
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1 text-indigo-500 hover:text-indigo-700"
              >
                <X size={14} />
              </button>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsInput;