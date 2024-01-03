import {Link} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill, BsStarFill} from 'react-icons/bs'
import './index.css'

const JobCardItem = props => {
  const {jobDetails} = props
  const {
    id,
    title,
    jobDescription,
    companyLogoUrl,
    employmentType,
    rating,
    location,
    packagePerAnnum,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="job-card-container">
        <div className="job-card-heading-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-rating-container">
            <h1 className="title-job-card">{title}</h1>
            <div className="rating-container">
              <BsStarFill className="star-icon" />
              <p className="rating-job-card">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-employment-package-container">
          <div className="location-employment-container">
            <div className="location-container">
              <MdLocationOn className="icon-heading" />
              <p className="icon-para">{location}</p>
            </div>
            <div className="location-container">
              <BsBriefcaseFill className="icon-heading" />
              <p className="icon-para">{employmentType}</p>
            </div>
          </div>
          <p className="package-para">{packagePerAnnum}</p>
        </div>
        <hr className="line" />
        <h3 className="job-description">Description</h3>
        <p className="job-card-para">{jobDescription}</p>
      </li>
    </Link>
  )
}
export default JobCardItem
