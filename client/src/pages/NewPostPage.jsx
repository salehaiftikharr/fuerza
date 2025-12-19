import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { postService } from '../services/postService'
import { exerciseService } from '../services/exerciseService'
import './NewPostPage.css'

const NewPostPage = () => {
  const navigate = useNavigate()
  const [caption, setCaption] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [exercises, setExercises] = useState([
    { exerciseTypeId: '', reps: '', sets: '', weight: '', restTime: '' }
  ])
  const [exerciseTypes, setExerciseTypes] = useState({ all: [], byMuscleGroup: {} })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadExerciseTypes()
  }, [])

  const loadExerciseTypes = async () => {
    try {
      const types = await exerciseService.getTypes()
      setExerciseTypes(types)
    } catch (err) {
      console.error('Error loading exercise types:', err)
    }
  }

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises]
    updated[index][field] = value
    setExercises(updated)
  }

  const addExercise = () => {
    setExercises([
      ...exercises,
      { exerciseTypeId: '', reps: '', sets: '', weight: '', restTime: '' }
    ])
  }

  const removeExercise = (index) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate exercises
    const validExercises = exercises.filter(ex =>
      ex.exerciseTypeId && ex.reps && ex.sets && ex.weight && ex.restTime
    )

    if (validExercises.length === 0) {
      setError('Please add at least one complete exercise')
      return
    }

    setLoading(true)

    try {
      await postService.createPost({
        caption,
        isPrivate,
        exercises: validExercises.map(ex => ({
          exerciseTypeId: parseInt(ex.exerciseTypeId),
          reps: parseInt(ex.reps),
          sets: parseInt(ex.sets),
          weight: parseFloat(ex.weight),
          restTime: parseInt(ex.restTime)
        }))
      })

      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="new-post-page">
      <div className="new-post-card">
        <h1>New Workout Post</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="caption">Caption (Optional)</label>
            <textarea
              id="caption"
              className="form-control"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="How was your workout?"
              rows={3}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <span>Private post (only visible to you)</span>
            </label>
          </div>

          <div className="exercises-section">
            <h3>Exercises</h3>

            {exercises.map((exercise, index) => (
              <div key={index} className="exercise-form">
                <div className="exercise-header">
                  <span>Exercise {index + 1}</span>
                  {exercises.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeExercise(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="exercise-fields">
                  <div className="form-group">
                    <label>Exercise Type</label>
                    <select
                      className="form-control"
                      value={exercise.exerciseTypeId}
                      onChange={(e) => handleExerciseChange(index, 'exerciseTypeId', e.target.value)}
                      required
                    >
                      <option value="">Select exercise...</option>
                      {Object.entries(exerciseTypes.byMuscleGroup).map(([group, types]) => (
                        <optgroup key={group} label={group}>
                          {types.map(type => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div className="exercise-stats-inputs">
                    <div className="form-group">
                      <label>Sets</label>
                      <input
                        type="number"
                        className="form-control"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                        min="1"
                        placeholder="3"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Reps</label>
                      <input
                        type="number"
                        className="form-control"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                        min="1"
                        placeholder="10"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Weight (lbs)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={exercise.weight}
                        onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                        min="0"
                        step="0.5"
                        placeholder="135"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Rest (sec)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={exercise.restTime}
                        onChange={(e) => handleExerciseChange(index, 'restTime', e.target.value)}
                        min="0"
                        placeholder="60"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="btn-add-exercise" onClick={addExercise}>
              + Add Exercise
            </button>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewPostPage
