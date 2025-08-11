import Hero from '@/components/Hero'
import EventsSection from '@/components/EventsSection'
import CoreTeamSection from '@/components/CoreTeamSection'
import TimelineSection from '@/components/TimelineSection'
import BlogSection from '@/components/BlogSection'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'
export default function Page(){
  return (<>
    <Hero/>
    <EventsSection/>
    <CoreTeamSection/>
    <TimelineSection/>
    <BlogSection/>
    <FAQSection/>
    <Footer/>
  </>)
}