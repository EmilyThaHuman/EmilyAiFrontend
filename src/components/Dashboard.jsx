import React, { useState } from 'react';

import CreateAssistant from './CreateAssistant';

const templates = [
  {
    name: 'ResearchGPT',
    category: 'Academics and Professional',
    description: 'Generate a thorough report on a specific subject',
  },
  {
    name: 'BrandGPT',
    category: 'Academics and Professional',
    description:
      "Evaluate a brand's performance, market position, and future prospects",
  },
  {
    name: 'TravelGPT',
    category: 'Other',
    description: 'Plan a detailed journey to a selected destination',
  },
  {
    name: 'PlatformerGPT',
    category: 'Creative and Social',
    description:
      'Code a platformer game featuring a popular character or theme',
  },
  {
    name: 'IndustryGPT',
    category: 'Academics and Professional',
    description:
      'Present a comprehensive review of an industry, covering key trends, players, and future predictions',
  },
  {
    name: 'ScraperGPT',
    category: 'Other',
    description: 'Extract and summarize data from a selected website',
  },
  {
    name: 'PostGPT',
    category: 'Creative and Social',
    description:
      'Create engaging captions and hashtags for your social media posts',
  },
  {
    name: 'EmailGPT',
    category: 'Academics and Professional',
    description: 'Compose a concise and detailed email',
  },
  {
    name: 'ResumeGPT',
    category: 'Academics and Professional',
    description:
      'Design a professional resume based on your career history and skills',
  },
  {
    name: 'NovelGPT',
    category: 'Creative and Social',
    description: 'Begin writing a novel in a selected genre',
  },
  {
    name: 'DietGPT',
    category: 'Health and Fitness',
    description:
      'Create a customized diet plan based on dietary preferences and goals',
  },
  {
    name: 'FitnessGPT',
    category: 'Health and Fitness',
    description: 'Design a workout regimen tailored to your fitness goals',
  },
  {
    name: 'MarketingGPT',
    category: 'Academics and Professional',
    description: 'Design a comprehensive marketing strategy for your business',
  },
  {
    name: 'BudgetGPT',
    category: 'Academics and Professional',
    description: 'Prepare a personal or family budget',
  },
  {
    name: 'StudyGPT',
    category: 'Academics and Professional',
    description: 'Design a study schedule to achieve your academic objectives',
  },
  {
    name: 'NewsGPT',
    category: 'Other',
    description: 'Author a detailed news article on a selected topic',
  },
  {
    name: 'EventPlannerGPT',
    category: 'Other',
    description: 'Organize a detailed schedule for your forthcoming event',
  },
  {
    name: 'BlogGPT',
    category: 'Creative and Social',
    description: 'Write a blog post on a selected topic',
  },
  {
    name: 'AstroGPT',
    category: 'Science and Technology',
    description:
      'Discuss astronomical phenomena, discoveries, and related technology',
  },
  {
    name: 'ArtReviewGPT',
    category: 'Creative and Social',
    description:
      'Critique a piece of art, discussing its style, context, and influence',
  },
];

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleOpen = template => {
    setSelectedTemplate(template);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="dashboard">
      <h1>Templates</h1>
      <p>Customizable and ready to deploy agents</p>
      <div className="template-grid">
        {templates.map(template => (
          <div
            key={template.name}
            className="template-card"
            onClick={() => handleOpen(template)}
            role="button"
            tabIndex={0}
            onKeyPress={() => handleOpen(template)}
          >
            <h2>{template.name}</h2>
            <p>{template.category}</p>
            <p>{template.description}</p>
          </div>
        ))}
      </div>
      {open && (
        <CreateAssistant template={selectedTemplate} onClose={handleClose} />
      )}
    </div>
  );
};

export default Dashboard;
