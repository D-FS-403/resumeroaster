import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ResuméRoast is Live on ProductHunt — 20% Off Pro with PHLAUNCH',
  description: 'ResuméRoast just launched on ProductHunt! Get brutally honest AI resume feedback, interview prep, cover letters, and ATS job matching. First 100 hunters get 20% off Pro.',
};

export default function LaunchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
