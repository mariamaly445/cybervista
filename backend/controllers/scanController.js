const VulnerabilityScan = require('../models/VulnerabilityScan');
const SecurityAlert = require('../models/SecurityAlert');

const mockVulnerabilityScanner = async (targetUrl, scanType) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const baseCount = scanType === 'full' ? 25 : scanType === 'quick' ? 10 : 15;
  
  return {
    critical: Math.floor(Math.random() * 3),
    high: Math.floor(Math.random() * 5),
    medium: Math.floor(Math.random() * baseCount),
    low: Math.floor(Math.random() * baseCount * 2),
    info: Math.floor(Math.random() * baseCount * 3),
    total: 0,
    findings: [
      {
        severity: 'high',
        description: 'SQL Injection vulnerability detected',
        recommendation: 'Use parameterized queries or prepared statements'
      },
      {
        severity: 'medium',
        description: 'Cross-Site Scripting (XSS) vulnerability',
        recommendation: 'Implement proper input validation and output encoding'
      }
    ]
  };
};

exports.createScan = async (req, res) => {
  try {
    const { targetUrl, scanType = 'quick', scanName } = req.body;
    const userId = req.user.userId;

    if (!targetUrl) {
      return res.status(400).json({
        success: false,
        message: 'Target URL is required'
      });
    }

    try {
      new URL(targetUrl);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    const scan = await VulnerabilityScan.create({
      userId,
      scanName: scanName || `Scan for ${targetUrl}`,
      targetUrl,
      scanType,
      status: 'pending',
      scanDate: new Date()
    });

    setTimeout(async () => {
      try {
        await VulnerabilityScan.findByIdAndUpdate(scan._id, {
          status: 'in_progress'
        });

        const results = await mockVulnerabilityScanner(targetUrl, scanType);
        results.total = results.critical + results.high + results.medium + results.low + results.info;
        
        const updatedScan = await VulnerabilityScan.findByIdAndUpdate(
          scan._id,
          {
            status: 'completed',
            completedAt: new Date(),
            results,
            scanDuration: Math.floor(Math.random() * 120) + 30
          },
          { new: true }
        );

        if (results.critical > 0 || results.high > 0) {
          await SecurityAlert.create({
            userId,
            title: `Critical vulnerabilities found in ${targetUrl}`,
            message: `Scan completed with ${results.critical} critical and ${results.high} high vulnerabilities.`,
            alertLevel: results.critical > 0 ? 'critical' : 'high',
            alertType: 'vulnerability',
            source: 'automated_scan',
            relatedScan: scan._id
          });
        }
      } catch (error) {
        console.error('Scan processing error:', error);
        
        await VulnerabilityScan.findByIdAndUpdate(scan._id, {
          status: 'failed',
          errorMessage: error.message
        });
      }
    }, 1000);

    res.status(201).json({
      success: true,
      message: 'Scan initiated successfully',
      data: {
        scan: {
          id: scan._id,
          scanName: scan.scanName,
          targetUrl: scan.targetUrl,
          scanType: scan.scanType,
          status: scan.status,
          scanDate: scan.scanDate
        }
      }
    });
  } catch (error) {
    console.error('Create scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getAllScans = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, status, scanType } = req.query;
    
    const filter = { userId };
    if (status) filter.status = status;
    if (scanType) filter.scanType = scanType;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const scans = await VulnerabilityScan.find(filter)
      .sort({ scanDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await VulnerabilityScan.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        scans,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get scans error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};