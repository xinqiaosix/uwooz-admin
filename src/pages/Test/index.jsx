import React from 'react'
import { connect, router } from 'dva'

const { Link } = router

class Test extends React.Component {
  
  render() {
    return (
      <div className="">
        <Link to="/proA" className="fds">/proA</Link>
      </div>
    )
  }
}

export default connect()(Test)
