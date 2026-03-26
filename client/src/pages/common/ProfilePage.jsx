import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { useAuth } from '../../hooks/useAuth';
import { getProfile, updateProfile } from '../../services/authService';

const ROLE_SPECIFIC_FIELDS = {
  admin: ['department', 'licenseNumber', 'experience'],
  lawyer: ['licenseNumber', 'specialization', 'experience', 'officeAddress'],
  judge: ['courtName', 'yearsOfService', 'specialization'],
  police: ['badgeNumber', 'division', 'yearsOfService', 'rank'],
  citizen: ['phone', 'address', 'city']
};

const FIELD_LABELS = {
  licenseNumber: 'License Number',
  specialization: 'Specialization',
  experience: 'Years of Experience',
  officeAddress: 'Office Address',
  courtName: 'Court Name',
  yearsOfService: 'Years of Service',
  badgeNumber: 'Badge Number',
  division: 'Division/Department',
  rank: 'Rank',
  department: 'Department',
  phone: 'Phone Number',
  address: 'Address',
  city: 'City'
};

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ 
    name: '', 
    email: '',
    profilePic: null,
    profilePicPreview: null
  });
  const [message, setMessage] = useState('');
  const [roleFields, setRoleFields] = useState({});
  const [picOption, setPicOption] = useState('gallery'); // 'gallery' or 'upload'
  const [galleryImages, setGalleryImages] = useState([]);

  // Initialize gallery images
  useEffect(() => {
    const defaultImages = [
      'https://ui-avatars.com/api/?name=User&background=0f172a&color=fff&bold=true',
      'https://ui-avatars.com/api/?name=Admin&background=1e40af&color=fff&bold=true',
      'https://ui-avatars.com/api/?name=Lawyer&background=92400e&color=fff&bold=true',
      'https://ui-avatars.com/api/?name=Judge&background=7c3aed&color=fff&bold=true',
      'https://ui-avatars.com/api/?name=Police&background=059669&color=fff&bold=true'
    ];
    setGalleryImages(defaultImages);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProfile();
        setForm({ 
          name: data.name || '', 
          email: data.email || '',
          profilePic: data.profilePic || null,
          profilePicPreview: data.profilePic || null
        });

        // Load role-specific fields
        const roleFieldsData = {};
        ROLE_SPECIFIC_FIELDS[user?.role]?.forEach(field => {
          roleFieldsData[field] = data[field] || '';
        });
        setRoleFields(roleFieldsData);
      } catch {
        setMessage('Could not load profile right now.');
      }
    };

    load();
  }, [user?.role]);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({
          ...prev,
          profilePic: file,
          profilePicPreview: reader.result
        }));
        setPicOption('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const selectGalleryImage = (imageUrl) => {
    setForm(prev => ({
      ...prev,
      profilePicPreview: imageUrl,
      profilePic: imageUrl
    }));
    setPicOption('gallery');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const updateData = {
        name: form.name,
        email: form.email,
        profilePic: form.profilePicPreview,
        ...roleFields
      };

      const updated = await updateProfile(updateData);
      login(updated);
      setMessage('Profile updated successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <PageTemplate title="Profile" description="Manage your account profile and personal information.">
      
      {/* Profile Picture Section */}
      <section className="card">
        <h3 style={{ margin: '0 0 16px', fontWeight: 800 }}>Profile Picture</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Picture Preview */}
          <div style={{ textAlign: 'center' }}>
            {form.profilePicPreview ? (
              <div style={{ 
                width: '120px', 
                height: '120px', 
                margin: '0 auto 12px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid var(--role-accent)',
                boxShadow: '0 4px 12px var(--role-shadow)'
              }}>
                <img 
                  src={form.profilePicPreview} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div style={{ 
                width: '120px', 
                height: '120px',
                margin: '0 auto 12px',
                borderRadius: '50%',
                background: 'var(--role-accent-light)',
                border: '2px dashed var(--role-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--role-accent-text)',
                fontSize: '3rem'
              }}>
                📷
              </div>
            )}
            <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: 'var(--role-accent-text)' }}>
              {form.profilePicPreview ? 'Current Picture' : 'No Picture'}
            </p>
          </div>

          {/* Upload Section */}
          <div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>Options</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button 
                  type="button"
                  onClick={() => setPicOption('gallery')}
                  className={picOption === 'gallery' ? 'btn-primary' : 'btn-secondary'}
                  style={{ flex: 1 }}
                >
                  Choose from Gallery
                </button>
                <button 
                  type="button"
                  onClick={() => setPicOption('upload')}
                  className={picOption === 'upload' ? 'btn-primary' : 'btn-secondary'}
                  style={{ flex: 1 }}
                >
                  Upload New
                </button>
              </div>
            </div>

            {picOption === 'gallery' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {galleryImages.map((img, idx) => (
                  <img 
                    key={idx}
                    src={img} 
                    alt={`Gallery ${idx}`}
                    onClick={() => selectGalleryImage(img)}
                    style={{
                      width: '100%',
                      height: '80px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: form.profilePicPreview === img ? '3px solid var(--role-accent)' : '2px solid var(--role-border)',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            )}

            {picOption === 'upload' && (
              <div>
                <label style={{ fontWeight: 700, marginBottom: '8px', display: 'block' }}>Upload Image</label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  style={{
                    padding: '8px',
                    border: '1.5px dashed var(--role-border)',
                    borderRadius: '8px',
                    width: '100%'
                  }}
                />
                <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '6px' }}>
                  JPG, PNG (Max 5MB)
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Basic Information */}
      <section className="card">
        <h3 style={{ margin: '0 0 16px', fontWeight: 800 }}>Basic Information</h3>
        <form className="stack-form" onSubmit={onSubmit}>
          <div>
            <label style={{ fontWeight: 700, marginBottom: '6px', display: 'block' }}>Name</label>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Full Name"
              required
            />
          </div>

          <div>
            <label style={{ fontWeight: 700, marginBottom: '6px', display: 'block' }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Email Address"
              required
            />
          </div>

          {/* Role-Specific Fields */}
          {Object.keys(roleFields).length > 0 && (
            <>
              <hr style={{ margin: '12px 0', border: 'none', borderTop: '1.5px solid var(--role-border)' }} />
              <h4 style={{ margin: '12px 0 12px', fontWeight: 700, color: 'var(--role-accent-text)' }}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Information
              </h4>
              {Object.keys(roleFields).map(field => (
                <div key={field}>
                  <label style={{ fontWeight: 700, marginBottom: '6px', display: 'block' }}>
                    {FIELD_LABELS[field] || field}
                  </label>
                  {field === 'officeAddress' || field === 'address' ? (
                    <textarea
                      value={roleFields[field]}
                      onChange={(event) => setRoleFields(prev => ({ ...prev, [field]: event.target.value }))}
                      placeholder={FIELD_LABELS[field] || field}
                      rows="3"
                    />
                  ) : (
                    <input
                      type={field === 'phone' ? 'tel' : field === 'yearsOfService' || field === 'experience' ? 'number' : 'text'}
                      value={roleFields[field]}
                      onChange={(event) => setRoleFields(prev => ({ ...prev, [field]: event.target.value }))}
                      placeholder={FIELD_LABELS[field] || field}
                    />
                  )}
                </div>
              ))}
            </>
          )}

          <button className="btn-primary" type="submit" style={{ marginTop: '8px', fontWeight: 800 }}>
            Save Profile
          </button>

          {message && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              borderLeft: '3px solid var(--role-accent)',
              background: 'var(--role-accent-light)',
              color: 'var(--role-accent-text)',
              fontWeight: 600
            }}>
              {message}
            </div>
          )}
        </form>
      </section>

    </PageTemplate>
  );
}
