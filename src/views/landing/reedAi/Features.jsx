import { Code2, Palette, Zap } from 'lucide-react';

import FeatureCard from './FeatureCard';

export const Features = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
    <FeatureCard
      icon={<Code2 className="h-12 w-12 mb-4 text-white" />}
      title="Intelligent Component Generation"
      description="Our AI analyzes your requirements and generates unique, highly practical React components tailored to your needs."
    />
    <FeatureCard
      icon={<Palette className="h-12 w-12 mb-4 text-white" />}
      title="Perfect Styling"
      description="Automatically apply beautiful, responsive designs using popular UI libraries like Material-UI, Chakra UI, and Tailwind CSS."
    />
    <FeatureCard
      icon={<Zap className="h-12 w-12 mb-4 text-white" />}
      title="Extensive Library Support"
      description="Seamlessly integrate with a wide range of JavaScript and UI libraries, ensuring your components are feature-rich and compatible."
    />
  </div>
);

export default Features;
