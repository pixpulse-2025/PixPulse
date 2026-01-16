# Report Artwork Feature - Quick Start Guide

## 🚀 Getting Started

### For Users

#### How to Report an Artwork

1. **Navigate to the artwork** you want to report
   - Go to `/artwork/:id` or click on any artwork from the marketplace

2. **Click the Report Button**
   - Scroll down to the sidebar
   - Find the "🚩 Report Artwork" button under the artist information
   - Click it to open the report modal

3. **Fill Out the Report Form**
   - **Reason:** Select from the dropdown (required)
     - Copyright Infringement
     - Inappropriate Content
     - Spam
     - Misleading Information
     - Hate Speech
     - Violence
     - Other
   - **Description:** Provide detailed information (min 10 characters, max 1000)
   - Click "Submit Report"

4. **View Your Reports**
   - Go to Dashboard → My Reports
   - Or navigate directly to `/my-reports`
   - Filter by status: All, Pending, Reviewing, Resolved, Dismissed
   - Check for admin responses

#### Report Status Meanings

- **⏳ Pending** - Report submitted, waiting for review
- **🔍 Reviewing** - Admin is currently reviewing the report
- **✅ Resolved** - Report has been addressed, action taken
- **❌ Dismissed** - Report was reviewed but no action needed

---

### For Administrators

#### Accessing the Admin Panel

1. Navigate to `/admin/reports`
2. You'll see the Reports Management dashboard

#### Dashboard Overview

**Statistics Cards:**
- Total Reports
- Pending Reports
- Reviewing Reports
- Resolved Reports
- Dismissed Reports

**Filter Tabs:**
- Click any tab to filter reports by status
- Count badges show number of reports in each category

#### Managing Reports

**For Each Report, You Can:**

1. **View Details**
   - Artwork preview and title
   - Reporter name and email
   - Report date
   - Reason (highlighted in red)
   - Full description

2. **Update Status**
   - Click "Update Status" button
   - Modal opens with:
     - Status dropdown (Pending, Reviewing, Resolved, Dismissed)
     - Admin Notes textarea
   - Add your notes explaining the decision
   - Click "Update Report"

3. **View Artwork**
   - Click "View Artwork" to open artwork in new tab
   - Review the reported content

4. **Delete Report**
   - Click "Delete" button
   - Confirm deletion
   - Report is permanently removed

#### Best Practices

**When Reviewing Reports:**

1. **Investigate Thoroughly**
   - View the artwork
   - Read the full description
   - Check reporter's history if needed

2. **Set Status Appropriately**
   - **Pending** → **Reviewing** when you start investigation
   - **Reviewing** → **Resolved** when action is taken
   - **Reviewing** → **Dismissed** when no action needed

3. **Always Add Admin Notes**
   - Explain your decision
   - Be professional and clear
   - Users can see these notes

4. **Take Action When Needed**
   - Remove artwork if it violates guidelines
   - Contact artist if necessary
   - Document actions in admin notes

---

## 🔧 Technical Setup

### Enable Admin Routes (Required for Admin Features)

**File:** `backend/src/routes/reportRoutes.js`

Uncomment the following lines:

```javascript
// Admin routes (uncomment when admin middleware is ready)
router.get("/", protect, authorize("admin"), getAllReports);
router.get("/artwork/:artworkId", protect, authorize("admin"), getArtworkReports);
router.patch("/:reportId", protect, authorize("admin"), updateReportStatus);
router.delete("/:reportId", protect, authorize("admin"), deleteReport);
```

**Make sure:**
- `authorize` middleware is properly configured
- Admin role checking is implemented
- User model has `role` field

---

## 📱 Navigation

### User Navigation
- **Dashboard** → My Reports
- **Artwork Detail Page** → Report Artwork button (sidebar)
- **Direct URL:** `/my-reports`

### Admin Navigation
- **Direct URL:** `/admin/reports`
- Add link to admin navbar/sidebar as needed

---

## 🎯 Common Use Cases

### User Scenarios

**Scenario 1: Copyright Infringement**
```
1. User finds their artwork uploaded by someone else
2. Clicks "Report Artwork"
3. Selects "Copyright Infringement"
4. Describes: "This is my original work from [date]. Here's proof: [link]"
5. Submits report
6. Checks My Reports for admin response
```

**Scenario 2: Inappropriate Content**
```
1. User sees NSFW content not marked appropriately
2. Reports with "Inappropriate Content"
3. Describes specific issues
4. Admin reviews and removes artwork
5. User sees "Resolved" status with admin note
```

### Admin Scenarios

**Scenario 1: Valid Copyright Claim**
```
1. Admin sees new pending report
2. Changes status to "Reviewing"
3. Verifies the claim
4. Removes the artwork
5. Updates status to "Resolved"
6. Adds note: "Artwork removed due to copyright violation. Original creator verified."
```

**Scenario 2: False Report**
```
1. Admin reviews report
2. Finds no violation
3. Changes status to "Dismissed"
4. Adds note: "Reviewed content. No policy violations found. Artwork remains live."
```

---

## 🔍 Troubleshooting

### Users

**Problem:** Can't submit report
- **Solution:** Make sure you're logged in
- **Solution:** Check that you haven't already reported this artwork

**Problem:** Don't see my report
- **Solution:** Navigate to `/my-reports`
- **Solution:** Try refreshing the page

**Problem:** Description too short error
- **Solution:** Provide at least 10 characters of detail

### Admins

**Problem:** Admin routes not working
- **Solution:** Uncomment routes in `reportRoutes.js`
- **Solution:** Verify admin middleware is configured

**Problem:** Can't update status
- **Solution:** Check authentication token
- **Solution:** Verify admin role permissions

---

## 📊 Monitoring & Analytics

### Key Metrics to Track

**For Admins:**
- Average response time to reports
- Most common report reasons
- Resolution rate
- False report rate
- Most reported artworks/artists

**Suggested Queries:**
```javascript
// Get reports by reason
const reportsByReason = await Report.aggregate([
  { $group: { _id: "$reason", count: { $sum: 1 } } }
]);

// Get average resolution time
const avgResolutionTime = await Report.aggregate([
  { $match: { status: "resolved" } },
  { $project: { 
    resolutionTime: { 
      $subtract: ["$resolvedAt", "$createdAt"] 
    }
  }},
  { $group: { 
    _id: null, 
    avgTime: { $avg: "$resolutionTime" } 
  }}
]);
```

---

## 🎨 UI Components Reference

### ReportArtworkModal
```jsx
<ReportArtworkModal
  artworkId="123456"
  artworkTitle="Neon Dreams"
  isOpen={showModal}
  onClose={() => setShowModal(false)}
/>
```

### Using Redux Actions
```javascript
import { useDispatch } from 'react-redux';
import { reportArtwork, getMyReports } from '../redux/slices/reportsSlice';

// Submit report
dispatch(reportArtwork({
  artworkId: '123',
  reportData: {
    reason: 'Spam',
    description: 'This is spam content...'
  }
}));

// Get user's reports
dispatch(getMyReports());

// Get all reports (admin)
dispatch(getAllReports({ status: 'pending' }));

// Update status (admin)
dispatch(updateReportStatus({
  reportId: '456',
  updateData: {
    status: 'resolved',
    adminNotes: 'Issue resolved.'
  }
}));
```

---

## 📞 Support

For issues or questions:
1. Check this guide
2. Review `REPORT_ARTWORK_IMPLEMENTATION.md`
3. Check Redux DevTools for state issues
4. Review browser console for errors
5. Check backend logs for API errors

---

## ✅ Checklist for Going Live

**Before Deployment:**
- [ ] Uncomment admin routes
- [ ] Test all user flows
- [ ] Test all admin flows
- [ ] Verify email notifications (if implemented)
- [ ] Test on mobile devices
- [ ] Test dark mode
- [ ] Review security settings
- [ ] Set up monitoring/analytics
- [ ] Train admin team
- [ ] Create community guidelines
- [ ] Set up escalation process

**Post-Deployment:**
- [ ] Monitor first reports closely
- [ ] Gather user feedback
- [ ] Track response times
- [ ] Adjust workflows as needed
- [ ] Document common issues
- [ ] Update guidelines based on patterns

---

## 🎉 You're All Set!

The Report Artwork feature is ready to use. Users can now report problematic content, and administrators have powerful tools to manage and respond to reports efficiently.

For detailed technical documentation, see `REPORT_ARTWORK_IMPLEMENTATION.md`.
