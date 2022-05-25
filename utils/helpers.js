module.exports = {
    format_date: (postedAt) => {
      // Format date as MM/DD/YYYY
      return postedAt.toLocaleDateString();
    },
    
  }