import TimelineSection from '@/components/TimelineSection'
export default function AboutPage(){
  return (<div className="section py-12 md:py-16" id="join">
    <h1 className="section-title">About</h1>
    <p className="mt-4 text-white/80 max-w-3xl">Mission statement goes here.</p>
    <TimelineSection/>
    <div className="mt-8"><a className="btn" href="#">Join Us</a></div>
  </div>)
}