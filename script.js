import config from './config.js';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    const fileUploadContainer = document.getElementById('file-upload');
    const fileInput = document.getElementById('file-input');
    
    // Check if we're on the syllabus page with file upload elements
    if (fileUploadContainer && fileInput) {
        const uploadIcon = document.querySelector('.upload-icon');
        const checkIcon = document.querySelector('.check-icon');
        const uploadText = document.querySelector('.upload-text');
        const uploadingText = document.querySelector('.uploading-text');
        const successText = document.querySelector('.success-text');
        const fileName = document.getElementById('file-name');
        const successFileName = document.getElementById('success-file-name');
        const syllabusItems = document.querySelector('.syllabi-list');

        // File Upload Functionality
        fileUploadContainer.addEventListener('click', () => {
            fileInput.click();
        });

        fileUploadContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInput.click();
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                processFile(e.target.files[0]);
            }
        });

        // Drag and drop functionality
        fileUploadContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadContainer.classList.add('dragging');
        });

        fileUploadContainer.addEventListener('dragleave', (e) => {
            e.preventDefault();
            fileUploadContainer.classList.remove('dragging');
        });

        fileUploadContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadContainer.classList.remove('dragging');
            if (e.dataTransfer.files.length > 0) {
                processFile(e.dataTransfer.files[0]);
            }
        });

        // Process the uploaded file
        function processFile(file) {
            // Check file type
            const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
            const isValidType = config.acceptedFileTypes.includes(fileExtension);
            
            // Check file size
            const maxSizeBytes = config.maxSizeMB * 1024 * 1024;
            const isValidSize = file.size <= maxSizeBytes;
            
            if (!isValidType) {
                showToast("Invalid file type", `Please upload files of type: ${config.acceptedFileTypes}`, "error");
                return;
            }
            
            if (!isValidSize) {
                showToast("File too large", `Maximum file size is ${config.maxSizeMB}MB`, "error");
                return;
            }
            
            // Show uploading state
            fileName.textContent = file.name;
            uploadText.classList.add('hidden');
            uploadingText.classList.remove('hidden');
            successText.classList.add('hidden');
            
            // Simulate upload delay for better UX
            setTimeout(() => {
                uploadFile(file);
            }, 1500);
        }

        // Simulate file upload
        function uploadFile(file) {
            // Here you would normally upload the file to a server
            // This is just a simulation
            uploadingText.classList.add('hidden');
            successText.classList.remove('hidden');
            uploadIcon.classList.add('hidden');
            checkIcon.classList.remove('hidden');
            fileUploadContainer.classList.add('success');
            successFileName.textContent = file.name;
            
            showToast("Upload successful", `${file.name} has been uploaded successfully.`, "success");
            
            // Add file to the list
            addFileToList(file);
            
            // Reset success state after 3 seconds
            setTimeout(() => {
                resetUploadState();
            }, 3000);
        }

        // Reset to initial state
        function resetUploadState() {
            uploadText.classList.remove('hidden');
            successText.classList.add('hidden');
            uploadIcon.classList.remove('hidden');
            checkIcon.classList.add('hidden');
            fileUploadContainer.classList.remove('success');
        }

        // Add file to the list
        function addFileToList(file) {
            const date = new Date();
            const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
            const fileSizeInKB = Math.round(file.size / 1024);
            
            const fileItem = document.createElement('div');
            fileItem.className = 'syllabi-item';
            fileItem.innerHTML = `
                <svg class="file-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    <path fill="currentColor" d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm160-14.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"/>
                </svg>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-meta">
                        <span>Uploaded on ${formattedDate}</span>
                        <span>PDF - ${fileSizeInKB} KB</span>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="action-btn download">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </button>
                    <button class="action-btn delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `;
            
            // Add delete functionality
            const deleteBtn = fileItem.querySelector('.delete');
            deleteBtn.addEventListener('click', () => {
                fileItem.remove();
                showToast("File deleted", `${file.name} has been deleted.`, "info");
            });
            
            // Add download functionality (simulated)
            const downloadBtn = fileItem.querySelector('.download');
            downloadBtn.addEventListener('click', () => {
                showToast("Download started", `Downloading ${file.name}...`, "info");
            });
            
            syllabusItems.appendChild(fileItem);
        }

        // Simple toast notification function
        function showToast(title, message, type = "info") {
            // Create toast container if it doesn't exist
            let toastContainer = document.querySelector('.toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.className = 'toast-container';
                document.body.appendChild(toastContainer);
            }
            
            // Create toast
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <div class="toast-content">
                    <div class="toast-title">${title}</div>
                    <div class="toast-message">${message}</div>
                </div>
            `;
            
            toastContainer.appendChild(toast);
            
            // Remove toast after animation completes
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }

        // Add sample file if list is empty and syllabusItems exists
        if (syllabusItems && syllabusItems.children.length === 0) {
            const sampleFile = {
                name: "syllabus.PDF",
                size: 214 * 1024 // 214 KB
            };
            addFileToList(sampleFile);
        }
    }

    // Test page category filters
    const categoryFilters = document.querySelectorAll('.category-filter');
    const testCards = document.querySelectorAll('.test-card');
    
    if (categoryFilters.length > 0) {
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Remove active class from all filters
                categoryFilters.forEach(f => f.classList.remove('active'));
                
                // Add active class to clicked filter
                filter.classList.add('active');
                
                // Get the category to filter by
                const category = filter.getAttribute('data-category');
                
                // Show all cards if "all" category is selected
                if (category === 'all') {
                    testCards.forEach(card => card.style.display = 'block');
                } else {
                    // Otherwise, filter cards
                    testCards.forEach(card => {
                        if (card.classList.contains(category)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    }

    // Initialize action buttons on test cards
    const actionButtons = document.querySelectorAll('.action-button');
    if (actionButtons.length > 0) {
        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const actionType = button.classList.contains('primary') ? 'primary' : 'secondary';
                const testName = button.closest('.test-card').querySelector('h3').textContent;
                
                showToast(
                    actionType === 'primary' ? "Action started" : "Action set", 
                    `${button.textContent} for "${testName}"`, 
                    "info"
                );
            });
        });
    }

    // Initialize navigation functionality regardless of page
    const homeLink = document.getElementById('home-link');
    const syllabusLink = document.getElementById('syllabus-link');
    
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            // Navigation handled by href attribute
        });
    }
    
    if (syllabusLink) {
        syllabusLink.addEventListener('click', (e) => {
            // Navigation handled by href attribute
        });
    }

    // Add Goal button functionality
    const addGoalBtn = document.querySelector('.add-goal-btn');
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', () => {
            // Simple implementation - in a real app this would open a form
            const goalId = `goal${Date.now()}`;
            const newGoal = document.createElement('div');
            newGoal.className = 'goal-item';
            newGoal.innerHTML = `
                <div class="goal-checkbox">
                    <input type="checkbox" id="${goalId}" class="goal-check">
                    <label for="${goalId}"></label>
                </div>
                <div class="goal-content">
                    <div class="goal-title">New Study Goal</div>
                    <div class="goal-meta">Due: May 30, 2023</div>
                </div>
            `;
            
            const goalList = document.querySelector('.goal-list');
            if (goalList) {
                goalList.prepend(newGoal);
                showToast("Goal Added", "New study goal has been added.", "success");
            }
        });
    }
    
    // Goal checkbox functionality
    const goalChecks = document.querySelectorAll('.goal-check');
    goalChecks.forEach(check => {
        check.addEventListener('change', (e) => {
            const goalItem = e.target.closest('.goal-item');
            if (goalItem) {
                if (e.target.checked) {
                    goalItem.classList.add('completed');
                    showToast("Goal Completed", "Congratulations on completing your goal!", "success");
                } else {
                    goalItem.classList.remove('completed');
                }
            }
        });
    });
    
    // Chart hover interactions for better UX
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach(bar => {
        bar.addEventListener('mouseenter', () => {
            chartBars.forEach(otherBar => {
                if (otherBar !== bar) {
                    otherBar.style.opacity = '0.3';
                }
            });
        });
        
        bar.addEventListener('mouseleave', () => {
            chartBars.forEach(otherBar => {
                otherBar.style.opacity = '0.7';
            });
        });
    });
});