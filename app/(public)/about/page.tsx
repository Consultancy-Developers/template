import {
  AboutCompanySection,
  FounderSection,
  GlobalServicesSection,
  IndustryVerticalsSection,
  TechnologyPlatformsSection,
  WhyChooseSection,
} from '@/components/CorporateSite'

export default function About() {
  return (
    <div>
      <AboutCompanySection />
      <IndustryVerticalsSection />
      <GlobalServicesSection />
      <TechnologyPlatformsSection />
      <FounderSection />
      <WhyChooseSection />
    </div>
  )
}
